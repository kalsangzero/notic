import { css } from '@emotion/react';
import { Slider } from '@material-ui/core';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import React, { useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player/lazy';

const playerWrapper = css`
  position: relative;
  width: 100%;
  max-width: 880px;
  height: 580px;
  padding: 10px;
`;
const controlsWrapper = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function ResponsivePlayer(props) {
  const playerRef = useRef();
  const [currentState, setCurrentState] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);

  const [volume, setVolume] = useState(0.5);
  const [seeking, setSeeking] = useState(false);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const onVolumeChange = (e, newValue) => {
    setVolume(parseFloat(newValue / 100, newValue === 0 ? true : false));
  };
  const onVolumeSeekUp = (e, newValue) => {
    setVolume(parseFloat(newValue / 100, newValue === 0 ? true : false));
  };
  const handleProgress = (changeState) => {
    console.log('onProgress', changeState);
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setCurrentState(changeState);
    }
  };
  console.log(currentState);

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };
  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value, 'fraction'));
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : '00:00';
  console.log('currentTime', currentTime);
  const theme = useTheme();

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : Number('00:00');

  return (
    <div css={playerWrapper}>
      <ReactPlayer
        ref={playerRef}
        url={props.url}
        width="100%"
        height="100%"
        controls={false}
        muted={muted}
        duration={duration}
        volume={volume}
        playing={paused}
        onProgress={handleProgress}
        config={{
          file: {
            attributes: {
              crossorigin: 'anonymous',
              SameSite: 'none',
            },
          },
          youtube: {
            playerVars: {
              showinfo: 0,
              disablekb: 1,
              iv_load_policy: 3,
              listlistType: 'search',
              modestbranding: 1,
              start: { currentState },
              controls: 0,
            },
          },
        }}
      />

      <div css={controlsWrapper}>
        <div>
          <input
            style={{ width: '800px', paddingTop: '3px' }}
            type="range"
            min={0}
            max={duration}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: -2,
            }}
          >
            <span>
              <IconButton
                aria-label={paused ? 'play' : 'pause'}
                onClick={() => setPaused(handlePlayPause)}
              >
                {paused === true ? (
                  <PauseRounded
                    sx={{ fontSize: '2rem' }}
                    htmlColor={mainIconColor}
                  />
                ) : (
                  <PlayArrowRounded
                    sx={{ fontSize: '2rem' }}
                    htmlColor={mainIconColor}
                  />
                )}
              </IconButton>
              <IconButton
                aria-label={muted ? 'muted' : 'unmuted'}
                onClick={() => setMuted(handleMute)}
              >
                {muted === true || volume === 0 ? (
                  <VolumeOffIcon
                    sx={{ fontSize: '2rem' }}
                    htmlColor={mainIconColor}
                  />
                ) : (
                  <VolumeUpIcon
                    sx={{ fontSize: '2rem' }}
                    htmlColor={mainIconColor}
                  />
                )}
              </IconButton>

              <Slider
                value={volume * 100}
                onChange={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
                min={0}
                max={100}
                style={{ width: '70px', paddingTop: '3px' }}
              />
            </span>
            <p>
              {formatDuration(Math.round(currentTime))}/
              {formatDuration(Math.round(duration))}
            </p>
          </Box>
        </div>
        <button
          style={{
            float: 'right',
            fontVariant: 'h4',
            background: 'transparent',
            cursor: 'pointer',
            padding: '5px 10px',
          }}
        >
          <BookmarkAddIcon />
        </button>
      </div>
    </div>
  );
}
