// transition'lar (css) linear ise bu hesaplar tututor. ama transition ease-in-out ise mesela timeoutduration bittiğinde henüz css animasyonu tamamlanmamış oluyor. O yüzden transitionend ile çözmek daha tutarlı oluyor.

function exitThis(comp, type, updateContext) {
  const now = Date.now();
  const { transition } = comp.router_settings;
  const enterDuration = transition.enter;
  const exitDuration = transition.exit || enterDuration;

  comp.timeCodes = comp.timeCodes || [];
  comp.timeCodes.push({ [type]: now });

  let netAnimationProgress = 0;

  // Calculate the net progress by replaying the timeline
  for (let i = 0; i < comp.timeCodes.length - 1; i++) {
    const currentEvent = comp.timeCodes[i];
    const nextEvent = comp.timeCodes[i + 1];

    const currentEventType = Object.keys(currentEvent)[0];
    const currentEventTime = currentEvent[currentEventType];
    const nextEventTime = nextEvent[Object.keys(nextEvent)[0]];

    const timeDelta = nextEventTime - currentEventTime;

    if (currentEventType === 'enter') {
      netAnimationProgress += timeDelta;
    } else { // exit
      netAnimationProgress -= timeDelta;
    }
    // Clamp the progress to stay within valid bounds
    netAnimationProgress = Math.max(0, Math.min(enterDuration, netAnimationProgress));
  }

  let timeoutDuration;
  if (type === 'enter') {
    // Time remaining to complete the enter animation
    timeoutDuration = Math.max(0, enterDuration - netAnimationProgress);
  } else { // exit
    // Time remaining to complete the exit animation (back to 0)
    timeoutDuration = Math.max(0, netAnimationProgress);
  }

  if (timeoutDuration == 0) {
    timeoutDuration = comp.router_settings.transition[type];
  }

  comp.setAttribute("transition", type);

  // Clear any existing timer
  try {
    clearTimeout(comp.transitionTimer);
  } catch (e) { }

  comp.transitionTimer = setTimeout(() => {

    // Reset timeline for the next independent transition chain
    comp.timeCodes = [];

    if (updateContext) {
      console.log("Router context updated!");
      nextEnter();
    }
  }, timeoutDuration);
}
