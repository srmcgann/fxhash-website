import { forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import style from './Artwork.module.scss'
import cs from "classnames"
import useAsyncEffect from "use-async-effect"
import { fetchRetry } from '../../utils/network'
import { LoaderBlock } from '../Layout/LoaderBlock'
import { Error } from '../Error/Error'

interface Props {
  url?: string
  textWaiting?: string
  onLoaded?: () => void
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
  reloadIframe_newhash: () => void
  getHtmlIframe: () => HTMLIFrameElement | null
}

export const ArtworkIframe = forwardRef<ArtworkIframeRef, Props>(({ url, textWaiting, onLoaded }, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  let originalSRC=''

  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [])

  const reloadIframe = () => {
    if (iframeRef.current) {
      setLoading(true)
      setError(false)
      originalSRC = originalSRC || iframeRef.current.src
      if(document.querySelectorAll('.newhashIframe').length){
        let els = document.querySelectorAll('.newhashIframe')
        for(let i = 0; i < els.length; ++i){
       // @ts-ignore: Object is possibly 'null'.
          els[i].parentNode.removeChild(els[i])
        }
      }
      iframeRef.current.style.display = 'block'
      iframeRef.current.src = originalSRC
    }
  }

  const reloadIframe_newhash = () => {
    if (iframeRef.current) {
      setLoading(true)
      setError(false)
      originalSRC = originalSRC || iframeRef.current.src
      fetch(originalSRC).then(res=>res.text()).then(data=>{
        let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
        let newhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('')
        let startpos = data.indexOf('var fxhash = \'')+14
        let newcontent = data.substr(0,startpos) + newhash + data.substr(startpos + 51)
        let oldURL = originalSRC
        newcontent = newcontent.replaceAll("'./", '\'')
        newcontent = newcontent.replaceAll("'/", '\'')
        newcontent = newcontent.replaceAll('"./', '"')
        newcontent = newcontent.replaceAll('"/', '"')
        newcontent = newcontent.replaceAll('  ', ' ')
        newcontent = newcontent.replaceAll('src=\'', 'src = \'')
        newcontent = newcontent.replaceAll('src =\'', 'src = \'')
        newcontent = newcontent.replaceAll('src="', 'src = "')
        newcontent = newcontent.replaceAll('src ="', 'src = "')
        newcontent = newcontent.replaceAll('src="', 'src = "')
        newcontent = newcontent.replaceAll('src= \'', 'src = \'')
        newcontent = newcontent.replaceAll('src = \'', 'src = \'' + oldURL + '/')
        newcontent = newcontent.replaceAll('src = "', 'src = "' + oldURL + '/')
        newcontent = newcontent.replaceAll('href=\'', 'href = \'')
        newcontent = newcontent.replaceAll('href =\'', 'href = \'')
        newcontent = newcontent.replaceAll('href="', 'href = "')
        newcontent = newcontent.replaceAll('href ="', 'href = "')
        newcontent = newcontent.replaceAll('href = \'', 'href = \'' + oldURL + '/')
        newcontent = newcontent.replaceAll('href = "', 'href = "' + oldURL + '/')
        newcontent = newcontent.replaceAll('url(', 'url(' + oldURL + '/')
        let oldhash=data.substr(startpos,51)
        // @ts-ignore: Object is possibly 'null'.
        let parent = iframeRef.current.parentNode
          // @ts-ignore: Object is possibly 'null'.
        if(typeof newhash_iframe != 'undefined'){
          // @ts-ignore: Object is possibly 'null'.
          let els = document.querySelectorAll('.newhashIframe')
          for(let i = 0; i < els.length; ++i){
          // @ts-ignore: Object is possibly 'null'.
            els[i].parentNode.removeChild(els[i])
          }
        } else {
          var newhash_iframe = document.createElement('iframe')
        }
        setTimeout(()=>{
          let newIframe = newhash_iframe
          newIframe.style.opacity = '0'
       // @ts-ignore: Object is possibly 'null'.
          parent.appendChild(newIframe)
       // @ts-ignore: Object is possibly 'null'.
          let cw = newIframe.contentWindow
       // @ts-ignore: Object is possibly 'null'.
          cw.document.open()
       // @ts-ignore: Object is possibly 'null'.
          cw.document.write(newcontent)
       // @ts-ignore: Object is possibly 'null'.
          newIframe.setAttribute('sandbox', 'allow-scripts')
       // @ts-ignore: Object is possibly 'null'.
          newIframe.className = iframeRef.current.className + ' newhashIframe'
       // @ts-ignore: Object is possibly 'null'.
          cw.document.close()
          newIframe.onload = () => {
            onLoaded && onLoaded()
            setLoading(false)
            newIframe.style.opacity = '1'
          }
          newIframe.onerror = () => setError(true)
          setTimeout(()=>{
         // @ts-ignore: Object is possibly 'null'.
            let els = document.querySelectorAll('.newhashIframe')
            if(els.length > 1){
              for(let i=0; i < els.length; ++i){
                if(i < els.length - 1){
               // @ts-ignore: Object is possibly 'null'.
                  els[i].parentNode.removeChild(els[i])
                }
              }
            }
          }, 0)
        }, 0)
        iframeRef.current.style.display='none'
      })
    }
  }

  const getHtmlIframe = (): HTMLIFrameElement|null => {
    return iframeRef.current
  }

  useImperativeHandle(ref, () => ({
    reloadIframe,
    reloadIframe_newhash,
    getHtmlIframe
  }))

  return (
    <div className={style.container}>
      <div className={cs(style['iframe-container'])}>
        <iframe 
          ref={iframeRef}
          src={url}
          sandbox="allow-scripts allow-same-origin"
          className={cs(style.iframe)}
          onLoad={() => {
            onLoaded && onLoaded()
            setLoading(false)
          }}
          onError={() => setError(true)}
        />
        {(loading && !error) &&(
          <LoaderBlock height="100%" className={cs(style.loader)}>{textWaiting}</LoaderBlock>
        )}
        {error && (
          <Error className={cs(style.error)}>
            Could not load the project
          </Error>
        )}
      </div>
    </div>
  )
})