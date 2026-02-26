/* global gapi, YT */
import React, { useEffect } from 'react';

const YouTubePrivateVideo = ({ videoUrl, privateKey, clientId, secretKey }) => {
  const getVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initializePlayer = async () => {
      try {
        // Load Google API and YouTube IFrame Player API scripts
        await loadScript('https://apis.google.com/js/api.js');
        await loadScript('https://www.youtube.com/iframe_api');

        // Authenticate the user
        gapi.load('client:auth2', () => {
          gapi.client
            .init({
              clientId: clientId,
              scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
            })
            .then(() => {
              const authInstance = gapi.auth2.getAuthInstance();
              if (!authInstance.isSignedIn.get()) {
                authInstance.signIn(); // Prompt the user to sign in
              }

              // Use privateKey and secretKey in API calls if needed
              fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=player`, {
                headers: {
                  Authorization: `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}`,
                  'X-Private-Key': privateKey,
                  'X-Secret-Key': secretKey,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Private video data:', data);
                  // Initialize YouTube Player
                  window.onYouTubeIframeAPIReady = () => {
                    new YT.Player('youtube-player', {
                      videoId: videoId,
                      events: {
                        onReady: (event) => {
                          event.target.playVideo();
                        },
                      },
                    });
                  };
                })
                .catch((error) => {
                  console.error('Error fetching private video data:', error);
                });
            })
            .catch((error) => {
              console.error('Error during gapi authentication:', error);
            });
        });
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();
  }, [videoId, clientId, privateKey, secretKey]);

  return <div id="youtube-player" style={{ width: '560px', height: '315px' }}></div>;
};

export default YouTubePrivateVideo;
