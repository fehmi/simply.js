// abl-simpler-video
// https://github.com/AbletonAG/abl-simpler-video#readme
// Version 4.0.0

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimplerVideo = function () {
  function SimplerVideo() {
    var _this = this;

    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SimplerVideo);

    var pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10"><rect fill="currentColor" width="3" height="10"/><rect fill="currentColor" x="5" width="3" height="10"/></svg>';
    var playIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56"><polygon fill="currentColor" points="0 0 0 56 48 28 0 0"/></svg>';
    var muteIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 18"><rect fill="currentColor" y="4" width="4" height="10"/><polygon fill="currentColor" points="14 18 6 14 6 4 14 0 14 18"/><polygon fill="currentColor" points="26 6.34 24.66 5 22 7.66 19.34 5 18 6.34 20.66 9 18 11.65 19.34 13 22 10.35 24.66 13 26 11.65 23.34 9 26 6.34"/></svg>';
    var unMuteIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18"><rect fill="currentColor" y="4" width="4" height="10"/><polygon fill="currentColor" points="14 18 6 14 6 4 14 0 14 18"/><path fill="currentColor" d="M18,6.23a3.79,3.79,0,0,1,0,5.53l1.22,1.17a5.38,5.38,0,0,0,0-7.86Z"/><path fill="currentColor" d="M20.15,4.19a6.58,6.58,0,0,1,0,9.61L21.38,15a8.21,8.21,0,0,0,0-12Z"/></svg>';

    var defaultState = {
      muted: true,
      alwaysMuted: state.element.dataset.alwaysMuted || false,
      paused: true,
      autoplay: false,
      playsInline: false,
      splashMode: false,
      preload: 'none',
      autoplayEnabled: true,
      className: 'abl-simpler-video',
      controlsClassName: 'abl-simpler-video__controls',
      playButtonClassName: 'abl-simpler-video__button abl-simpler-video__button--play',
      pausedLabel: playIcon,
      pausedClassName: 'abl-simpler-video__button--is-paused',
      playingLabel: pauseIcon,
      playingClassName: 'abl-simpler-video__button--is-playing',
      muteButtonClassName: 'abl-simpler-video__button abl-simpler-video__button--mute',
      mutedLabel: muteIcon,
      mutedClassName: 'abl-simpler-video__button--is-muted',
      unmutedLabel: unMuteIcon,
      unmutedClassName: 'abl-simpler-video__button--is-unmuted',
      videoPoster: state.element.dataset.videoPoster,
      videoSrc: state.element.dataset.videoSrc,
      playCallBack: function playCallBack() {
        return false;
      },
      pauseCallBack: function pauseCallBack() {
        return false;
      },
      muteCallBack: function muteCallBack() {
        return false;
      },
      unmuteCallBack: function unmuteCallBack() {
        return false;
      }
    };

    var initialState = _extends(defaultState, state);

    var videoElement = document.createElement('video');
    videoElement.autoplay = initialState.autoplay;
    videoElement.muted = videoElement.defaultMuted = initialState.muted;
    videoElement.loop = initialState.loop;
    videoElement.src = initialState.videoSrc;
    videoElement.poster = initialState.videoPoster;
    videoElement.preload = initialState.preload;
    videoElement.playsInline = initialState.playsInline;
    videoElement.addEventListener('pause', function () {
      _this.handleVideoPause();
    });
    videoElement.addEventListener('playing', function () {
      _this.handleVideoPlaying();
    });
    videoElement.addEventListener('webkitbeginfullscreen', function () {
      _this.handleVideoBeginFullScreen();
    });
    videoElement.addEventListener('webkitendfullscreen', function () {
      _this.handleVideoEndFullScreen();
    });

    var controls = document.createElement('div');
    controls.className = initialState.controlsClassName;

    var playButton = document.createElement('button');
    playButton.addEventListener('click', function () {
      _this.handlePlayButtonClick();
    });
    controls.appendChild(this.updateButton(playButton, this.getPlayButtonState(initialState)));

    var muteButton = document.createElement('button');
    if (initialState.alwaysMuted) {
      muteButton.setAttribute('disabled', 'disabled');
      muteButton.style.display = 'none';
    }
    muteButton.addEventListener('click', function () {
      _this.handleMuteButtonClick();
    });
    controls.appendChild(this.updateButton(muteButton, this.getMuteButtonState(initialState)));

    // Move fallback content into video element
    while (initialState.element.hasChildNodes()) {
      videoElement.appendChild(initialState.element.firstChild);
    }

    initialState.element.appendChild(videoElement);
    initialState.element.appendChild(controls);
    initialState.element.classList.add(initialState.className);

    this.state = _extends(initialState, {
      videoElement: videoElement,
      playButton: playButton,
      muteButton: muteButton
    });

    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.paused = this.paused.bind(this);
    this.enableAutoplay = this.enableAutoplay.bind(this);
    this.disableAutoplay = this.disableAutoplay.bind(this);
    this.autoplayEnabled = this.autoplayEnabled.bind(this);
    this.handleVideoBeginFullScreen = this.handleVideoBeginFullScreen.bind(this);
    this.handleVideoEndFullScreen = this.handleVideoEndFullScreen.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.muted = this.muted.bind(this);
    this.render = this.render.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.getPlayButtonState = this.getPlayButtonState.bind(this);
    this.getMuteButtonState = this.getMuteButtonState.bind(this);
    this.getElement = this.getElement.bind(this);
    this.getVideoElement = this.getVideoElement.bind(this);
    this.setSplashMode = this.setSplashMode.bind(this);
    this.getSplashMode = this.getSplashMode.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleMuteButtonClick = this.handleMuteButtonClick.bind(this);
    this.handleVideoPlaying = this.handleVideoPlaying.bind(this);
    this.handleVideoPause = this.handleVideoPause.bind(this);
  }

  _createClass(SimplerVideo, [{
    key: 'pause',
    value: function pause() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.videoElement.pause();
    }
  }, {
    key: 'play',
    value: function play() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.videoElement.play();
    }
  }, {
    key: 'handleVideoPlaying',
    value: function handleVideoPlaying() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      var nextState = _extends(prevState, { paused: false, splashMode: false });
      nextState.playCallBack();
      render(nextState);
      return nextState;
    }
  }, {
    key: 'handleVideoPause',
    value: function handleVideoPause() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      var nextState = _extends(prevState, { paused: true });
      nextState.pauseCallBack();
      render(nextState);
      return nextState;
    }
  }, {
    key: 'paused',
    value: function paused() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.paused;
    }
  }, {
    key: 'enableAutoplay',
    value: function enableAutoplay() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      var nextState = _extends(prevState, { autoplayEnabled: true });
      return nextState;
    }
  }, {
    key: 'disableAutoplay',
    value: function disableAutoplay() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      var nextState = _extends(prevState, { autoplayEnabled: false });
      return nextState;
    }
  }, {
    key: 'autoplayEnabled',
    value: function autoplayEnabled() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.autoplayEnabled;
    }
  }, {
    key: 'mute',
    value: function mute() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      var nextState = _extends(prevState, { muted: true });
      nextState.muteCallBack();
      render(nextState);
      return nextState;
    }
  }, {
    key: 'unmute',
    value: function unmute() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.render;

      if (prevState.alwaysMuted) {
        return prevState;
      }
      var nextState = _extends(prevState, { muted: false });
      nextState.unmuteCallBack();
      render(nextState);
      return nextState;
    }
  }, {
    key: 'muted',
    value: function muted() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.muted;
    }
  }, {
    key: 'handlePlayButtonClick',
    value: function handlePlayButtonClick() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      if (state.paused) {
        this.play();
      } else {
        this.pause();
        this.disableAutoplay();
      }
    }
  }, {
    key: 'handleMuteButtonClick',
    value: function handleMuteButtonClick() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      if (state.muted) {
        this.unmute();
      } else {
        this.mute();
      }
    }
  }, {
    key: 'handleVideoBeginFullScreen',
    value: function handleVideoBeginFullScreen() {
      var video = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      video.setSplashMode();
      // Unmute video when entering fullscreen on iOS
      video.unmute();
    }
  }, {
    key: 'handleVideoEndFullScreen',
    value: function handleVideoEndFullScreen() {
      var video = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      video.setSplashMode();
    }
  }, {
    key: 'updateButton',
    value: function updateButton(buttonElement, buttonState) {
      buttonElement.innerHTML = buttonState.innerHTML;
      buttonElement.className = buttonState.className;
      return buttonElement;
    }
  }, {
    key: 'updateVideoElement',
    value: function updateVideoElement(videoElement) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;

      buttonElement.innerHTML = buttonState.innerHTML;
      buttonElement.className = buttonState.className;
      return buttonElement;
    }
  }, {
    key: 'updateElement',
    value: function updateElement(element) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;

      if (state.splashMode) {
        element.classList.add('abl-simpler-video--is-splash');
      } else {
        element.classList.remove('abl-simpler-video--is-splash');
      }

      if (state.paused) {
        element.classList.remove('abl-simpler-video--is-playing');
        element.classList.add('abl-simpler-video--is-paused');
      } else {
        element.classList.remove('abl-simpler-video--is-paused');
        element.classList.add('abl-simpler-video--is-playing');
      }
    }
  }, {
    key: 'getPlayButtonState',
    value: function getPlayButtonState(state) {
      return state.paused ? { innerHTML: state.pausedLabel, className: state.playButtonClassName + ' ' + state.pausedClassName } : { innerHTML: state.playingLabel, className: state.playButtonClassName + ' ' + state.playingClassName };
    }
  }, {
    key: 'getMuteButtonState',
    value: function getMuteButtonState(state) {
      return state.muted ? { innerHTML: state.mutedLabel, className: state.muteButtonClassName + ' ' + state.mutedClassName } : { innerHTML: state.unmutedLabel, className: state.muteButtonClassName + ' ' + state.unmutedClassName };
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.element;
    }
  }, {
    key: 'getVideoElement',
    value: function getVideoElement() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.videoElement;
    }
  }, {
    key: 'setSplashMode',
    value: function setSplashMode() {
      var splashMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var prevState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.render;

      var nextState = _extends(prevState, { splashMode: splashMode });
      // Don't show native video controls in splashMode
      nextState.videoElement.controls = false;
      render(nextState);
      return nextState;
    }
  }, {
    key: 'getSplashMode',
    value: function getSplashMode() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      return state.splashMode;
    }
  }, {
    key: 'render',
    value: function render() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

      state.videoElement.muted = state.muted;

      this.updateButton(state.playButton, this.getPlayButtonState(state));
      this.updateButton(state.muteButton, this.getMuteButtonState(state));
      this.updateElement(state.element);
    }
  }]);

  return SimplerVideo;
}();