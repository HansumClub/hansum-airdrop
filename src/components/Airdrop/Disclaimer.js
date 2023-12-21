import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Modal,
  Box,
} from "@mui/material";

const isBrowser = typeof window !== "undefined";

const agreementStorageHandler = {
  setAgreed: () => {
    localStorage.setItem("disclaimer_agreed", "true");
  },
  getAgreed: () => {
    if (!isBrowser || !window.localStorage) return false;
    return !!localStorage.getItem("disclaimer_agreed");
  },
};
const HansumDisclaimer = () => {
  const [open, setOpen] = useState(!agreementStorageHandler.getAgreed());
  const handleClose = () => setOpen(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const termsStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90vw",
    width: "100%",
    height: "700px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "hidden",
    // overflow: "scroll",
  };
  const handleAgree = () => {
    agreementStorageHandler.setAgreed();
    setOpen(false);
  };
  const boxScrollerRef = React.useRef(null);
  const handleScrollTarget = (target) => {
    let isAtBottomOfScroll =
      Math.round(target.scrollHeight - target.scrollTop) == target.clientHeight;
    console.table({
      scrollHeight: target.scrollHeight,
      scrollTop: target.scrollTop,
      clientHeight: target.clientHeight,
      isAtBottomOfScroll,
    });
    // if not scrollable at all
    if (target.scrollHeight === target.clientHeight) {
      isAtBottomOfScroll = true;
    }
    console.log(isAtBottomOfScroll, isAtBottom);
    if (isAtBottomOfScroll !== isAtBottom) {
      setIsAtBottom(isAtBottomOfScroll);
    }
  };
  const handleScroll = (e) => handleScrollTarget(e.currentTarget);
  // effect for scroll ref
  React.useEffect(() => {
    const boxScroller = boxScrollerRef.current;
    if (boxScroller) {
      handleScrollTarget(boxScroller);
    }
  }, [boxScrollerRef.current]);

  return (
    <Modal
      disablePortal
      open={open}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        overflow: "scroll",
      }}
    >
      <Box sx={termsStyle}>
        <Box
          sx={{
            position: "relative",
            height: "100%",
            overflow: "scroll",
            paddingBottom: 5,
          }}
          onScroll={handleScroll}
          onScrollCapture={handleScroll}
          ref={boxScrollerRef}
        >
          <Typography variant="h6" gutterBottom>
            HANSUM Token Disclaimer
          </Typography>
          <Typography variant="body2" paragraph>
            PLEASE READ THIS DISCLAIMER CAREFULLY. YOUR PARTICIPATION IN THE
            HANSUM COMMUNITY AND USE OF THE HANSUM TOKEN ("HANSUM") CONSTITUTES
            ACCEPTANCE OF THE TERMS AND CONDITIONS STATED HEREIN.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Nature and Purpose</strong>: HANSUM, a CW20 token operating
            on the Juno network, is intended solely as a social, recreational
            token aimed at community engagement within a lifestyle brand. Its
            purpose is to foster camaraderie and encourage men to enhance their
            lives through enjoyment, not financial gain.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Not an Investment</strong>: Participation in the HANSUM
            community and use of the HANSUM token does not represent an
            investment in any common enterprise or collaborative financial
            undertaking. There is no expectation of profit from the HANSUM
            token.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>No Financial Application</strong>: HANSUM has no financial
            applications and should not be regarded or used as a financial
            instrument, money, or as an investment vehicle. The token's sole use
            is for community involvement, akin to an in-game currency for
            entertainment purposes.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>No Derived Value from Others' Efforts</strong>: The HANSUM
            token's value is not, nor is it intended to be, derived from the
            managerial or entrepreneurial efforts of others.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Limitation of Liability</strong>: No individual, entity, or
            party involved in the HANSUM project shall bear any liability for
            any losses, damages, or claims related to the possession, use, or
            distribution of the HANSUM token. Your participation is at your own
            risk.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Acceptance and Compliance</strong>: By using the HANSUM
            token, you acknowledge, agree to, and accept these terms and all
            applicable laws and regulations. Non-compliance with these terms may
            result in legal action.
          </Typography>
          <Typography variant="body2" paragraph>
            This disclaimer is subject to change at our sole discretion without
            notice. Continuous use of the HANSUM token will be considered your
            acceptance of any revisions.
          </Typography>
          <Typography variant="body2">
            For further inquiries or information, please seek legal advice or
            contact our legal department.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "auto",
              padding: 1,
              boxShadow: isAtBottom ? 0 : 24,
              bgcolor: "background.paper",
            }}
          >
            <Button
              sx={{
                mt: 0,
                background: "#f3b23e",
                color: "white",
                border: "white 1px solid",
                minWidth: "250px",
              }}
              disabled={!isAtBottom}
              onClick={handleAgree}
              size="large"
              variant="contained"
            >
              {
                // tell them to keep scrolling if not at bottom yet
                !global.window ? "Loading airdrop data..." : (!isAtBottom ? "Keep Scrolling" : "I Agree")
              }
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default HansumDisclaimer;
