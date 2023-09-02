import { useI18n } from '@solid-primitives/i18n'
import { IconBrandSpeedtest } from '@tabler/icons-solidjs'
import { Show, createSignal } from 'solid-js'
import Collapse from '~/components/Collpase'
import ForTwoColumns from '~/components/ForTwoColumns'
import ProxyCardGroups from '~/components/ProxyCardGroups'
import ProxyNodePreview from '~/components/ProxyNodePreview'
import { useProxies } from '~/signals/proxies'
import type { Proxy } from '~/types'
import { getBtnElFromClickEvent } from '~/utils/proxies'

export default () => {
  const [t] = useI18n()
  const { proxies, setProxyGroupByProxyName, delayTestByProxyGroupName } =
    useProxies()

  const [collapsedMap, setCollapsedMap] = createSignal<Record<string, boolean>>(
    {},
  )

  const onProxyNodeClick = async (proxy: Proxy, proxyName: string) => {
    setProxyGroupByProxyName(proxy, proxyName)
  }

  const onSpeedTestClick = async (e: MouseEvent, name: string) => {
    const el = getBtnElFromClickEvent(e)

    el.classList.add('animate-pulse')
    e.stopPropagation()
    await delayTestByProxyGroupName(name)
    el.classList.remove('animate-pulse')
  }

  return (
    <div class="flex flex-col gap-2">
      <h1 class="flex h-8 items-center pb-2 text-lg font-semibold">
        {t('proxies')}
      </h1>
      <ForTwoColumns
        subChild={proxies().map((proxy) => {
          const title = (
            <>
              <div class="mr-10 flex items-center justify-between">
                <span>{proxy.name}</span>
                <button
                  class="btn btn-circle btn-sm"
                  onClick={(e) => onSpeedTestClick(e, proxy.name)}
                >
                  <IconBrandSpeedtest />
                </button>
              </div>
              <div class="text-sm text-slate-500">
                {proxy.type} :: {proxy.now}
              </div>
              <Show when={!collapsedMap()[`group-${proxy.name}`]}>
                <ProxyNodePreview
                  proxyNameList={proxy.all ?? []}
                  now={proxy.now}
                />
              </Show>
            </>
          )

          const content = (
            <ProxyCardGroups
              proxies={proxy.all!}
              now={proxy.now}
              onClick={(name) => {
                onProxyNodeClick(proxy, name)
              }}
            />
          )

          return (
            <Collapse
              isOpen={collapsedMap()[`group-${proxy.name}`]}
              title={title}
              content={content}
              onCollapse={(val) =>
                setCollapsedMap({
                  ...collapsedMap(),
                  [`group-${proxy.name}`]: val,
                })
              }
            />
          )
        })}
      />
    </div>
  )
}
