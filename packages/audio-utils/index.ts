/**
 * pad the start of an audio buffer with N milliseconds
 * of silence.
 */
export function padStart(
  context: AudioContext,
  buffer: AudioBuffer,
  milliseconds: number = 0
): AudioBuffer {
  const seconds = milliseconds / 1000;

  if (seconds === 0) {
    return buffer;
  }

  const updatedBuffer = context.createBuffer(
    buffer.numberOfChannels,
    Math.ceil(buffer.length + seconds * buffer.sampleRate),
    buffer.sampleRate
  );

  for (
    let channelNumber = 0;
    channelNumber < buffer.numberOfChannels;
    channelNumber++
  ) {
    const channelData = buffer.getChannelData(channelNumber);
    updatedBuffer
      .getChannelData(channelNumber)
      .set(channelData.subarray(0, Math.ceil(0 * buffer.sampleRate) + 1), 0);

    updatedBuffer
      .getChannelData(channelNumber)
      .set(
        channelData.subarray(
          Math.ceil(0 * buffer.sampleRate) + 2,
          updatedBuffer.length + 1
        ),
        Math.ceil((0 + seconds) * buffer.sampleRate)
      );
  }

  return updatedBuffer;
}

const a = new AudioContext();

// from stack overflow
function k(w: number, x: number, y: number) {
  console.log("Gain:" + w, "Hz:" + x, "ms:" + y);
  let v = a.createOscillator();
  let u = a.createGain();
  v.connect(u);
  v.frequency.value = x;
  v.type = "square";
  u.connect(a.destination);
  u.gain.value = w * 0.01;
  v.start(a.currentTime);
  v.stop(a.currentTime + y * 0.001);
}

/**
 * Play a short beep.
 */
export function playBeep() {
  const ms = 20;
  return k(100, 330, ms);
}
