import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconBase(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    />
  )
}

export const SparkIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
  </IconBase>
)

export const VolumeIcon = (props: IconProps & { muted?: boolean }) => {
  const { muted, ...rest } = props
  return (
    <IconBase {...rest}>
      <path d="M11 5 6.6 9H3v6h3.6L11 19z" />
      {muted ? (
        <>
          <path d="m16 9 4 6" />
          <path d="m20 9-4 6" />
        </>
      ) : (
        <>
          <path d="M15.5 9.2a4.5 4.5 0 0 1 0 5.6" />
          <path d="M18.6 6.8a8 8 0 0 1 0 10.4" />
        </>
      )}
    </IconBase>
  )
}

export const ThemeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.4 9.7A7 7 0 0 1 12 3.5Z" />
  </IconBase>
)

export const DownloadIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 4v10" />
    <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
    <path d="M5 18h14" />
  </IconBase>
)

export const UploadIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 20V10" />
    <path d="m8.5 13.5 3.5-3.5 3.5 3.5" />
    <path d="M5 6h14" />
  </IconBase>
)

export const InstallIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 4v10" />
    <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
    <rect x="4.5" y="16" width="15" height="4" rx="1.6" />
  </IconBase>
)

export const SettingsIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z" />
    <path d="M19.3 15.1 21 12l-1.7-3.1-3.2.2-1.9-2.6L11 5l-3.2 1.5-1.9 2.6-3.2-.2L1 12l1.7 3.1 3.2-.2 1.9 2.6L11 19l3.2-1.5 1.9-2.6z" />
  </IconBase>
)

export const ChevronLeftIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m14.5 6-6 6 6 6" />
  </IconBase>
)

export const ChevronRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m9.5 6 6 6-6 6" />
  </IconBase>
)

export const ExpandIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M8 4H4v4" />
    <path d="M16 4h4v4" />
    <path d="M20 16v4h-4" />
    <path d="M4 16v4h4" />
    <path d="m4 8 5-5" />
    <path d="m20 8-5-5" />
    <path d="m4 16 5 5" />
    <path d="m20 16-5 5" />
  </IconBase>
)

export const CloseIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </IconBase>
)

export const PlusIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
)

export const CheckIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m5.5 12.5 4 4L18.5 8" />
  </IconBase>
)

export const TrashIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 7h14" />
    <path d="M9.5 7V5.5h5V7" />
    <path d="M8 7v11" />
    <path d="M16 7v11" />
    <path d="M6.5 18.5h11" />
  </IconBase>
)

export const CalendarIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="4" y="5" width="16" height="15" rx="3" />
    <path d="M8 3.5V7" />
    <path d="M16 3.5V7" />
    <path d="M4 9.5h16" />
  </IconBase>
)

export const QuoteIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M10.2 8.1c-1.8.6-3.2 2.2-3.2 4.7v3.1H3.5v-3.1c0-4 2.4-7.1 6-8.1z" />
    <path d="M20.5 8.1c-1.8.6-3.2 2.2-3.2 4.7v3.1h-3.5v-3.1c0-4 2.4-7.1 6-8.1z" />
  </IconBase>
)

export const DragIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 6h.01" />
    <path d="M15 6h.01" />
    <path d="M9 12h.01" />
    <path d="M15 12h.01" />
    <path d="M9 18h.01" />
    <path d="M15 18h.01" />
  </IconBase>
)
