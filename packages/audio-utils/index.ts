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
      .set(
        channelData.subarray(0, Math.ceil(0 * buffer.sampleRate) + 1),
        0
      );

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
