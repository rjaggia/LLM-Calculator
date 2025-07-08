import './globals.css'

export const metadata = {
  title: 'Amazon Bedrock LLM Selector',
  description: 'Find the best LLM for your needs on Amazon Bedrock',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}