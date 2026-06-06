import React from 'react'

import {
  BoxIcon,
  ConfluenceIcon,
  DropboxIcon,
  GitBookIcon,
  GithubIcon,
  GoogleDriveIcon,
  ICloudIcon,
  MegaCloudIcon,
  NotionIcon,
  OneDriveIcon,
  SharePointIcon,
  LocalUploadIcon
} from '../../../../public/icons/IconSvg.js'
import Image from 'next/image.js'

// wave: radius index (0=near, 1=mid, 2=far)
// angle: 0°=left edge, 90°=straight down, 180°=right edge
// dx: horizontal nudge in px — negative=left, positive=right
// dy: vertical nudge in px — negative=up, positive=down
// iconW/iconH: icon size in px (defaults to 20x20)
const sources = [
  { Icon: BoxIcon,         label: 'Box',        wave: 0, angle: 0,  dx: -60, dy: 0, iconW: 20, iconH: 20 },
  { Icon: GoogleDriveIcon, label: 'G-Drive',    wave: 0, angle: 0,  dx: 65,  dy: 0, iconW: 20, iconH: 20 },
  { Icon: ConfluenceIcon,  label: 'Confluence', wave: 0, angle: 28, dx: 7,   dy: 0, iconW: 20, iconH: 20 },
  { Icon: GithubIcon,      label: 'GitHub',     wave: 1, angle: 30, dx: -70, dy: 10, iconW: 20, iconH: 20 },
  { Icon: DropboxIcon,     label: 'Dropbox',    wave: 1, angle: 30, dx: -160,dy: -10, iconW: 20, iconH: 20 },
  { Icon: NotionIcon,      label: 'Notion',     wave: 1, angle: 30, dx: -200,dy: -60, iconW: 20, iconH: 20 },
  { Icon: GitBookIcon,     label: 'GitBook',     wave: 1, angle: 30,  dx: 20, dy: -10, iconW: 20, iconH: 20 },
  { Icon: ICloudIcon,      label: 'iCloud',      wave: 1, angle: 30, dx: 70, dy:-65, iconW: 20, iconH: 20 },
  { Icon: MegaCloudIcon,   label: 'MegaCloud',   wave: 2, angle: 30,  dx: 40, dy:-20, iconW: 20, iconH: 20 },
  { Icon: OneDriveIcon,    label: 'OneDrive',    wave: 2, angle: 35,  dx: -300,dy:-30, iconW: 20, iconH: 20 },
  { Icon: SharePointIcon,  label: 'SharePoint',  wave: 2, angle: 30, dx: -350, dy:-70, iconW: 20, iconH: 20 },
  { Icon: LocalUploadIcon,  label: 'Local Upload',  wave: 2, angle: 30, dx: 100, dy:-70, iconW: 20, iconH: 20 },
]

// Pixel radii for the 3 waves (relative to the hemisphere center)
const waveRadii = [30, 120, 180]

const DataSourcesCard = () => {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ zIndex: 0 }}>
      {/* ── Center anchor sits at 18% from top, horizontally centered ── */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '53%' }}>


        {/* ContextGPT hemisphere icon — bottom half only */}
        <div
          className="relative z-10"
          style={{
            width: 72,
            height: 36,          // half height = hemisphere
            overflow: 'hidden',
            transform: 'translateX(-50%)',
            left: '50%',
          }}
        >
          <Image
            src="/icons/Contextgpt_icon.svg"
            alt="Contextgpt"
            width={90}
            height={90}
            className="absolute bottom-0 left-0 "
          />
        </div>

        {/* Data source icons spread below in radar waves */}
        {sources.map((source) => {
          const r   = waveRadii[source.wave]
          // angle: 0°=left, 90°=bottom-center, 180°=right
          // map angle to standard math angle: 180° - angle, so 90°→90° (down), 0°→180° (left), 180°→0° (right)
          const rad = ((0 - source.angle) * Math.PI) / 180
          const x   =  r * Math.cos(rad) + (source.dx ?? 0)
          const y   = -r * Math.sin(rad) + (source.dy ?? 0)
          return (
            <div
              key={source.label}
              className="absolute flex flex-col items-center gap-1"
              style={{
                // Center of the icon tile is at (x, y) from the anchor
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
              }}
            >
              <div className="rounded-xl border border-white/60 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                style={{ width: source.iconW, height: source.iconH }}>
                <source.Icon width={source.iconW} height={source.iconH} />
              </div>
              <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap">
                {source.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DataSourcesCard
