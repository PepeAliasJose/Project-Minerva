import { Html } from '@react-three/drei'
import { useConfig } from '../../App'

function SkyTag ({
  name,
  color = ' bg-white',
  top = false,
  position = [0, 0, 0],
  occlude = 'blending',
  text = true,
  big = false
}) {
  const { tags } = useConfig()

  return (
    <Html
      position={position}
      zIndexRange={[40, 10]}
      className='-translate-y-1/2 bg-transparent '
    >
      {tags && (
        <div
          className={
            'text-[var(--soft-text)] text-xs inline-flex gap-2 bg-transparent ' +
            (big
              ? ' -translate-y-[1.5px] -translate-x-[3px] '
              : '  -translate-y-[1px] -translate-x-[1px] ')
          }
        >
          <div
            className={
              (big ? ' size-1.5 ' : ' size-0.5  ') + ' rounded-full ' + color
            }
          />
          {text && (
            <p className={'' + (top && ' -translate-y-full ')}>{name}</p>
          )}
        </div>
      )}
    </Html>
  )
}

export default SkyTag
