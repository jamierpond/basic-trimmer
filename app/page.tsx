"use client"
import { useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import WavesurferPlayer from '@wavesurfer/react'
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions.js'

const DEFAULT_START = 0
const MIN_LENGTH = 15;
const DEFAULT_END = DEFAULT_START + MIN_LENGTH;

export default function Page() {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: WaveSurfer) => {
    const regions = RegionsPlugin.create();
    regions.on('region-out', (region: Region) => {
      region.play();
    });

    ws.registerPlugin<RegionsPlugin>(regions);
    const r = regions.addRegion({
      start: DEFAULT_START,
      end: DEFAULT_END,
      color: 'rgba(255, 0, 0, 0.5)',
      minLength: MIN_LENGTH,
    });

    r.on('update', () => {
      console.log('update', r.start, r.end);
      if (r.start > ws.getCurrentTime()) {
        r.play();
      }
    });

    setWavesurfer(ws);
    setIsPlaying(false);
  }

  const onPlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        console.log('pause')
        wavesurfer.pause();
      } else {
        console.log('play')
        wavesurfer.play();
      }
    }
  }

  return (
    <>
      <WavesurferPlayer
        height={100}
        waveColor="violet"
        url="https://pond.audio/marvin.mp3"
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button onClick={onPlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </>
  )
}
