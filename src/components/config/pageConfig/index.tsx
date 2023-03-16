import GlobalStyle from './GlobalStyle'

interface PageConfigProps {
  title: string
  description?: string
  children: React.ReactNode
}

const PageConfig = (props: PageConfigProps) => {
  const { title, description, children } = props
  return (
    <>
      <header>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="../../../public/favicon.ico" type="image/x-icon" />
      </header>
      <main>
        <GlobalStyle />
        {children}
      </main>
    </>
  )
}

export default PageConfig
