import React from 'react'
import { Code2, TextCursorInputIcon, TrendingUp } from 'lucide-react'

const FeaturesCards = () => {
  const cards = [
    {
      id: 1,
      title: 'API',
      description: 'Build custom integrations with our powerful REST and WebSocket APIs.',
      icon: Code2
    },
    {
      id: 2,
      title: 'Whitelabel',
      description: 'Remove any ContextGPT branding from the chat widget embedded in your website',
      icon: TextCursorInputIcon
    },
    {
      id: 3,
      title: 'Always improving',
      description: 'We are constantly working on improving our product and adding new features.',
      icon: TrendingUp
    }
  ]

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className="flex items-start gap-3"
              >
                {/* <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"> */}
                  <Icon className="w-5 h-5 text-gray-700" />
                {/* </div> */}
                <div>
                  <h3 className="text-lg font-normal text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturesCards
