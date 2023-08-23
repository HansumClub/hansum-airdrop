import * as React from "react";
import { Container, Grid, Link, Typography } from "@mui/material";
import Layout from "../layout";
import Airdrop from "../components/Airdrop";
import BackgroundImage from "../images/background.png";
import { StaticImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";

// set cursor as emoji
function emojiAsCursor(emojiStr) {
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='68px' width='68px' style='fill:black;font-size:32px;'><text y='50%'>${emojiStr}</text></svg>"), auto`;
}

const styles = {
  background: {
    minHeight: "100vh",
    minWidth: "100vw",
    // backgroundImage: `url(${ BackgroundImage })`,
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), #252628`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  logoWrapper: {
    textAlign: "center",
    paddingTop: "10px",
    marginBottom: "-50px",
  },
};

const IndexPage = () => {
  return (
    <main style={styles.background}>
      <Helmet title="HANSUM Airdrop" defer={false} />
      <StaticImage
        height={230}
        alt="Literally Ken"
        src="../images/palm-leaves-right.png"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          maxHeight: "50vh",
          cursor: emojiAsCursor(`🏖️`),
        }}
      />
      <StaticImage
        height={250}
        alt="Literally Ken"
        src="../images/palm-leaves-right-left.png"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          maxHeight: "50vh",
          cursor: emojiAsCursor(`🏄‍♂️`),
        }}
      />
      <Layout>
        <Container>
          <div style={styles.logoWrapper}>
            <StaticImage
              height={150}
              src="../images/gray-logo.png"
              alt="Logo"
              style={{
                cursor: emojiAsCursor(`🚬`),
              }}
            />
          </div>

          <Grid container justifyContent="center" alignItems="center">
            <StaticImage
              style={{ maxWidth: "80vw" }}
              src="../images/hero-image.png"
              alt="Logo"
            />

            <Grid item xs={12} md={6}>
              <Airdrop />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </main>
  );
};

export default IndexPage;
