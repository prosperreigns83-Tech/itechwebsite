import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from '../Login'
import { describe, it, expect } from 'vitest'

describe('Login component', () => {
  it('renders create account button when not existing user', () => {
    const onLogin = () => {}
    const onNavigate = () => {}
    render(<Login storedAccount={null} onLogin={onLogin} onNavigate={onNavigate} />)
    const btn = screen.getByRole('button', { name: /create account/i })
    expect(btn).toBeTruthy()
  })
})
