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
import React, { useState } from 'react';
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
  const [currentState, setCurrentState] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
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
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setCurrentState(changeState);
    }
  };

  const handleSeekChange = (e) => {
    setCurrentState(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    props.playerRef.current.seekTo(parseFloat(e.target.value, 'fraction'));
  };
  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const currentTime =
    props.playerRef && props.playerRef.current
      ? props.playerRef.current.getCurrentTime()
      : '00:00';

  const theme = useTheme();

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const duration = props.playerRef.current
    ? props.playerRef.current.getDuration()
    : Number('00:00');

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }
  return (
    <div css={playerWrapper}>
      <ReactPlayer
        ref={props.playerRef}
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
              autoplay: 0,
              controls: 0,
              rel: 0,
              fs: 0,
              showinfo: 0,
              modestbranding: 1,
              enablejsapi: 1,
              disablekb: 1,
              iv_load_policy: 3,
              listType: 'search',

              start: { currentState },

              origin: 'http://localhost:3000/',
            },
          },
        }}
      />

      <div css={controlsWrapper}>
        <div>
          <input
            style={{ width: '800px' }}
            type="range"
            min={0}
            max={duration}
            step={1}
            value={currentState.playedSeconds}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
          </div>
        </div>
        <button
          style={{
            float: 'right',
            fontVariant: 'h4',
            background: 'transparent',
            cursor: 'pointer',
            padding: '5px 10px',
          }}
          onClick={props.addBookmark}
        >
          <BookmarkAddIcon />
        </button>
      </div>
    </div>
  );
}
