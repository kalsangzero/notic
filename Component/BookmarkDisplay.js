import { css } from '@emotion/react';
import { Grid, Paper, Typography } from '@material-ui/core';

const controlsWrapper = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function BookmarkDisplay(props) {
  return (
    <div css={controlsWrapper}>
      <Grid container style={{ marginTop: 20 }} spacing={3}>
        {bookmarks.map((bookmark, index) => (
          <Grid key={index} item>
            <Paper
              onClick={() => {
                playerRef.current.seekTo(bookmark.time);
                controlsRef.current.style.visibility = 'visible';

                setTimeout(() => {
                  controlsRef.current.style.visibility = 'hidden';
                }, 1000);
              }}
              elevation={3}
            >
              <img crossOrigin="anonymous" src={bookmark.image} />
              <Typography variant="body2" align="center">
                bookmark at {bookmark.display}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
