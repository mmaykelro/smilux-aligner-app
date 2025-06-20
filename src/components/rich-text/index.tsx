import {
  RichText as PayloadRichText,
  defaultJSXConverters,
} from '@payloadcms/richtext-lexical/react'

export default function RichText({ data }: { data: any }) {
  const customConverters = {
    // Converter para parágrafos personalizados
    'custom-paragraph': ({ node }: { node: any }) => {
      if (!node.children || node.children.length === 0) {
        return <br />
      }

      return (
        <p
          style={{ backgroundColor: node.textStyle || 'transparent' }}
          className="mb-4 text-gray-800"
        >
          {node.children.map((child: any, index: number) => {
            if (child.type === 'text') {
              return (
                <span
                  key={index}
                  style={{
                    fontWeight: child.format === 1 ? 'bold' : 'normal',
                    ...(child.style ? parseInlineStyle(child.style) : {}),
                  }}
                >
                  {child.text}
                </span>
              )
            }
            if (child.type === 'linebreak') {
              return <br key={index} />
            }
            if (child.type === 'link') {
              return (
                <a
                  key={index}
                  href={child.fields.url}
                  target={child.fields.newTab ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  style={{
                    ...(child.children[0]?.style ? parseInlineStyle(child.children[0].style) : {}),
                  }}
                  className="text-blue-600 underline"
                >
                  {child.children.map((linkChild: any, linkIndex: number) => (
                    <span key={linkIndex}>{linkChild.text}</span>
                  ))}
                </a>
              )
            }
            return null
          })}
        </p>
      )
    },

    // Converter para cabeçalhos personalizados
    'custom-heading': ({ node }: { node: any }) => {
      const HeadingTag = node.tag || 'h3' // Usa a tag especificada ou 'h3' como padrão
      return (
        <HeadingTag className="text-xl font-bold mb-4">
          {node.children.map((child: any, index: number) => (
            <span
              key={index}
              style={{
                ...(child.style ? parseInlineStyle(child.style) : {}),
              }}
            >
              {child.text}
            </span>
          ))}
        </HeadingTag>
      )
    },

    // Converter para vídeos do YouTube
    youtube: ({ node }: any) => {
      return (
        <div className={`w-full `}>
          <div className="relative w-full mt-1 pb-[56.25%] bg-gray-100">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${node.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )
    },
  }

  // Função para converter estilos inline em um objeto CSS
  const parseInlineStyle = (style: string) => {
    return style.split(';').reduce((acc: any, rule: string) => {
      const [property, value] = rule.split(':').map((item) => item.trim())
      if (property && value) {
        acc[property] = value
      }
      return acc
    }, {})
  }

  return (
    <PayloadRichText
      data={data}
      converters={{
        ...defaultJSXConverters,
        ...customConverters,
      }}
    />
  )
}
