import { Grid, Typography } from "@mui/material";
import * as React from "react";
import { useCountdown } from "../../utils/useCountdown";

const Countdown = (props) => {
  const { timestampEnd } = props;
  const [days, hours, minutes, seconds] = useCountdown(timestampEnd);

  if (days + hours + minutes + seconds <= 0) {
    return <h1>Airdrop is live!</h1>;
  } else {
    return (
      <Grid
        style={
          {
            // fontFamily: "monospace",
          }
        }
        container
        sx={{ padding: 0, mt: 3 }}
      >
        <Grid item xs={12} md={3}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
              // fontFamily: "monospace",
            }}
          >
            {days.toString().padStart(2, "0")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
              // fontFamily: "monospace",
            }}
          >
            days
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
              // fontFamily: "monospace",
            }}
          >
            {hours.toString().padStart(2, "0")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
            }}
          >
            hours
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
            }}
          >
            {minutes.toString().padStart(2, "0")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
            }}
          >
            minutes
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
            }}
          >
            {seconds.toString().padStart(2, "0")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "gray",
              fontVariant: "small-caps",
            }}
          >
            seconds
          </Typography>
        </Grid>
      </Grid>
    );
  }
};
export default Countdown;
