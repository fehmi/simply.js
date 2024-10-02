(function ($, _, window, document) {
  "use strict";

  var videoElements = document.querySelectorAll('.js-simpler-video')
  var inlineVideos = []

  function inViewport (element) {
    var bounding = element.getBoundingClientRect()
    return (
      bounding.bottom >= 0 &&
      bounding.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  function distanceFromCenterY (element) {
    var bounding = element.getBoundingClientRect()
    return Math.abs(
      ((window.innerHeight || document.documentElement.clientHeight) / 2 ) -
      (bounding.top + (bounding.height / 2))
    )
  }

  function playCallBack () {
    window.soundcloudPlayers.pause()
  }

  function muteCallBack () {
    window.inlineVideos.mutePlayers()

    // Send mediaPlayEvent to Media Controller
    var mediaSource = video.getElement();
    var mediaPlayEvent = new CustomEvent('mediaMute', { bubbles: true });
    mediaSource.dispatchEvent(mediaPlayEvent);
  }

  function unmuteCallBack () {
    window.inlineVideos.unmutePlayers()
    window.soundcloudPlayers.pause()

    // Send mediaPlayEvent to Media Controller
    var mediaSource = video.getElement();
    var mediaPlayEvent = new CustomEvent('mediaUnmute', { bubbles: true });
    mediaSource.dispatchEvent(mediaPlayEvent);
  }

  for (var i = 0; i < videoElements.length; i++) {
    var element = videoElements[i]
    var video = new SimplerVideo({
      element: element,
      loop: true,
      muted: true,
      playCallBack: function () { playCallBack() },
      muteCallBack: function () { muteCallBack() },
      unmuteCallBack: function () { unmuteCallBack() }
    })

    inlineVideos.push(video)
  }

  var canAutoPlay = true
  var activeVideoIndex = 0

  window.addEventListener('scroll', _.throttle(function () {
    if (canAutoPlay) {
      var previousActiveVideoIndex = activeVideoIndex
      inlineVideos.forEach(function (video, index) {
        var el = video.getElement()
        var distActiveVideo = distanceFromCenterY(inlineVideos[activeVideoIndex].getElement())
        if (distanceFromCenterY(el) < distActiveVideo) {
          activeVideoIndex = index
        }
      })

      inlineVideos.forEach(function (video, index) {
        var shouldPlay = (
          window.inlineVideos.autoPlayEnabled &&
          video.paused() &&
          video.autoplayEnabled() &&
          index === activeVideoIndex &&
          inViewport(video.getVideoElement())
        )

        var shouldPause = (
          !video.paused() &&
          index !== activeVideoIndex
        ) || (
          !video.paused() &&
          !inViewport(video.getVideoElement())
        )

        if (shouldPlay) {
          var playPromise = video.play()

          if (playPromise) {
            playPromise.catch(function (error) {
              if (error.name === 'NotAllowedError') {
                canAutoPlay = false
                inlineVideos.forEach(function (video) {
                  video.setSplashMode()
                })
              }
            })
          }
        } else if (shouldPause) {
          video.pause()
        }
      })
    }
  }, 500))

  window.inlineVideos = {}
  window.inlineVideos.mutePlayers = function () {
    inlineVideos.forEach(function (video) {
      if (!video.muted()) {
        video.mute()
      }
    })
  }
  window.inlineVideos.unmutePlayers = function () {
    inlineVideos.forEach(function (video) {
      if (video.muted()) {
        video.unmute()
      }
    })
  }
  window.inlineVideos.pauseActiveVideo = function () {
    inlineVideos.forEach(function (video) {
      if (!video.paused()) {
        video.pause()
      }
    })
  }
  window.inlineVideos.playAllVideos = function () {
    inlineVideos.forEach(function (video) {
      if (video.paused()) {
        video.play()
      }
    })
  }
  window.inlineVideos.enableAutoplay = function () {
    window.inlineVideos.autoPlayEnabled = true
  }
  window.inlineVideos.disableAutoplay = function () {
    window.inlineVideos.autoPlayEnabled = false
  }
  window.inlineVideos.enableAutoplay()
})(window.jQuery, window._, window, document);
