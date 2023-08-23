// React
import React, { useState, useEffect } from "react";

// MUI
import {
  Grid,
  Box,
  CircularProgress,
  Button,
  Alert,
  Typography,
  Link,
  Modal,
} from "@mui/material";

// Other Components
import Countdown from "../Countdown";
import ProgressBar from "@ramonak/react-progress-bar";

// Utils
import { getClient, junoConfig, USE_TESTNET } from "../../utils/keplrConnect";
import {
  hasClaimed,
  contracts,
  getMerkleProof,
  addTokenToKeplr,
} from "../../utils/hansum";
import { CosmWasmClient } from "cosmwasm";
import HansumDisclaimer from "./Disclaimer";

// Wen airdrop?
// May 29th, use to test app before it goes live
// const AIRDROP_START = 1653816800000;

// Real dates - June 6th 12:00 UTC to Aug 31st 12:00 UTC
const AIRDROP_START = 1692410045080;
const AIRDROP_END = 1704110400000;

const js_epoch_to_nanos = (js_epoch) => js_epoch * 1000000;

const end = Date.now() + 15 * 1000;

// set cursor as emoji
function emojiAsCursor(emojiStr) {
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='128px' width='128px' style='fill:black;font-size:32px;transform: translateY(-32px);'><text y='50%'>${emojiStr}</text></svg>"), auto`;
}

/**
 * Airdrop Component
 */
const Airdrop = () => {
  const [client, setClient] = useState(null); // Signing CosmWasm Client
  const [userAddress, setUserAddress] = useState(null); // User Wallet Address
  const [totalClaimed, setTotalClaimed] = useState(0); // Total Claimed in this airdrop stage
  const [totalUnclaimed, setTotalUnclaimed] = useState(0);
  const [error, setError] = useState(null); // Error?
  const [success, setSuccess] = useState(null); // Success?
  const [claiming, setClaiming] = useState(false); // Loading yes/no
  const [claimData, setClaimData] = useState({}); // Merkle Claim Data

  // Airdrop file
  const airdrop_data = {
    entries: require(`../../data/hansum-airdrop.json`),
  };

  // Airdrop started?
  const airdrop_started = new Date().getTime() > AIRDROP_START;
  const airdrop_ended = new Date().getTime() > AIRDROP_END;

  /**
   * Connect Wallet & Check eligibility
   */
  const handleConnect = async () => {
    setClaiming(true);
    try {
      const c = await getClient();
      setClient(c);
      const { address } = (await c.signer.getAccounts())[0];
      setUserAddress(address);
      const proofs = airdrop_data.entries;
      console.log(`Loaded ${proofs.length} entries`);
      console.log(`Looking for ${address}`);

      const cd = proofs.find((el) => el.address === address);

      if (!cd) {
        setError(
          "You're not eligible to claim HANSUM Tokens. Please try another address."
        );
      } else if (await hasClaimed(c, address)) {
        setError("You already claimed your tokens!");
      } else {
        setClaimData(cd);
        setError(false);
      }
    } catch (e) {
      setError(e.message);
    }
    setClaiming(false);
  };

  const handleClaimSlowAndStake = () => handleClaim(true, true);
  const handleClaimSlow = () => handleClaim(true, false);

  const handleClaimFast = () => handleClaim(false);

  /**
   * Claim if eligible
   */
  const handleClaim = async (slow, shouldStake) => {
    if (!claimData) {
      setError(
        "This address is not eligible. Try connecting another address from Keplr"
      );
    } else {
      try {
        setClaiming(true);
        await addTokenToKeplr();
        const msg = {
          claim: {
            amount: claimData.amount.toString(),
            proof: getMerkleProof(airdrop_data, userAddress, slow),
            stage: 1,
          },
        };

        console.log(msg);

        const data = await client.executeMultiple(
          userAddress,
          [
            { contractAddress: contracts.airdropAddr, msg },
            ...(shouldStake
              ? [
                  {
                    contractAddress: contracts.tokenAddr,
                    msg: {
                      send: {
                        amount: claimData.amount.toString(),
                        contract: contracts.stakingAddr,
                        msg: "eyJzdGFrZSI6IHt9fQ==",
                      },
                    },
                  },
                ]
              : []),
          ],
          {
            gas: "25000000",
            amount: [{ denom: "ujuno", amount: "8560149" }],
          }
        );

        if (data.logs.length > 0) {
          setError(null);
          setSuccess(
            `Successfully claimed ${
              claimData.amount / 1000000
            } HANSUM. \nTX Hash: ${data.transactionHash}`
          );
          // setTimeout(() => {
          //   window.location.assign(
          //     "https://daodao.zone/dao/juno1wkztwmn859207xhzn4s7h9tdp9ye2z0hrhph5ka67nl8mgxktt9s5rwmzv/proposals"
          //   );
          // }, 2000);
        } else {
          setError("Unknown error");
        }
      } catch (e) {
        setError(e.message);
      }

      setClaiming(false);
    }
  };

  /**
   * Load up initial aidrop state
   */
  useEffect(() => {
    async function load() {
      try {
        console.log(junoConfig.rpcEndpoint);
        // make use we have no NaN values
        setTotalUnclaimed(500000);
        var client = await CosmWasmClient.connect(junoConfig.rpcEndpoint);
        var data = await client.queryContractSmart(contracts.airdropAddr, {
          total_claimed: { stage: 1 },
        });
        var data2 = await client.queryContractSmart(contracts.airdropAddr, {
          merkle_root: { stage: 1 },
        });
        console.log({ data });
        setTotalClaimed(data.total_claimed / 1000000);
        setTotalUnclaimed(data2.total_amount / 1000000);
        console.log(`Got rpc response: ${data}`);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          {claiming && (
            <Box>
              <CircularProgress />
            </Box>
          )}
          {/* MUI Modal for Terms & Disclaimer */}
          <HansumDisclaimer />
          {claimData.length}
          {!claiming && Object.keys(claimData).length === 0 && (
            <Button
              sx={{
                mt: 3,
                background: "#f3b23e",
                color: "white",
                border: "white 1px solid",
                minWidth: "250px",
                cursor: emojiAsCursor(`🤑`),
              }}
              onClick={handleConnect}
              size="large"
              variant="contained"
            >
              Connect Wallet & Check eligibility
            </Button>
          )}

          {Object.keys(claimData).length > 0 && !!success && (
            <>
              <Button
                variant="contained"
                size="large"
                href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.hansum.club&via=HansumToken&text=Feeling%20%24HANSUM%20%uD83D%uDE0E"
                target="_blank"
                sx={{
                  mt: 3,
                  background: "#f3b23e",
                  color: "white",
                  border: "white 1px solid",
                  minWidth: "250px",
                  cursor: emojiAsCursor(`🐦`),
                }}
              >
                🕊️ Tweet About It!
              </Button>
              <Button
                variant="text"
                size="large"
                href="https://daodao.zone/dao/juno1wkztwmn859207xhzn4s7h9tdp9ye2z0hrhph5ka67nl8mgxktt9s5rwmzv/proposals"
                target="_blank"
                referrerPolicy="no-referrer"
                sx={{
                  mt: 3,
                  color: "white",
                  minWidth: "250px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  cursor: emojiAsCursor(`🪒`),
                }}
              >
                💈 The Barber Shop DAO
              </Button>
            </>
          )}

          {Object.keys(claimData).length > 0 && !success && (
            <>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 3, color: "white" }}
              >
                Your account with the address <strong>{userAddress}</strong> is
                eligible for a total of{" "}
                <strong>{claimData.amount / 1000000} $HANSUM</strong>!
              </Typography>
              {airdrop_started && (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleClaimSlowAndStake}
                    sx={{
                      mt: 3,
                      background: "#f3b23e",
                      color: "white",
                      border: "white 1px solid",
                      minWidth: "250px",
                      cursor: emojiAsCursor(`🥩`),
                    }}
                  >
                    Claim and Stake!
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    onClick={handleClaimSlow}
                    sx={{
                      mt: 3,
                      color: "white",
                      minWidth: "250px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      cursor: emojiAsCursor(`🥺`),
                    }}
                  >
                    Claim Only
                  </Button>
                </>
              )}
            </>
          )}
          <Typography sx={{ mt: 4 }} variant="body2" color="gray">
            <Link
              sx={{
                color: "gray",
                fontWeight: "light",
                cursor: emojiAsCursor(`🤓`),
              }}
              href="/hansum-airdrop.json"
              target="_blank"
              rel="noreferrer"
            >
              Merkle Airdrop JSON Source
            </Link>
          </Typography>
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
          {success && (
            <Alert sx={{ mt: 2, textAlign: "left" }} severity="success">
              {success}
            </Alert>
          )}
        </Grid>
      </Grid>

      {!airdrop_ended && (
        // <Countdown
        //   timestampEnd={airdrop_started ? AIRDROP_END : AIRDROP_START}
        // />
        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
            color: "white",
          }}
          variant="body1"
        >
          Claims end January 1st, 2024
        </Typography>
      )}
      {airdrop_started && (
        <Grid sx={{ py: 10 }} container>
          <Grid item xs={6} sx={{}}>
            <Typography variant="body2" color="white">
              Total claimed: {(totalClaimed / 1000).toFixed(1)}K $HANSUM
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ProgressBar
              completed={((100 * totalClaimed) / totalUnclaimed).toFixed(2)}
              customLabel={
                ((100 * totalClaimed) / totalUnclaimed).toFixed(2) + "%"
              }
              bgColor="#f3b23e"
              labelColor="#f3b23e"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Airdrop;
