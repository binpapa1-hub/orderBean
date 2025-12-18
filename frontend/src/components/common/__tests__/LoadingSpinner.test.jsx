import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  test('기본 렌더링', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('기본 크기 (md) 적용', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-12')
    expect(spinner).toHaveClass('w-12')
  })

  test('small 크기 적용', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-6')
    expect(spinner).toHaveClass('w-6')
  })

  test('large 크기 적용', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-16')
    expect(spinner).toHaveClass('w-16')
  })

  test('기본 색상 (primary) 적용', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('border-primary-600')
  })

  test('gray 색상 적용', () => {
    const { container } = render(<LoadingSpinner color="gray" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('border-gray-600')
  })

  test('white 색상 적용', () => {
    const { container } = render(<LoadingSpinner color="white" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('border-white')
  })

  test('fullScreen prop 적용', () => {
    const { container } = render(<LoadingSpinner fullScreen />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('min-h-screen')
  })

  test('text prop 표시', () => {
    render(<LoadingSpinner text="로딩 중..." />)
    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  })

  test('text prop 없을 때 텍스트 미표시', () => {
    const { container } = render(<LoadingSpinner />)
    const textElement = container.querySelector('p')
    expect(textElement).not.toBeInTheDocument()
  })

  test('접근성: role 및 aria-label 포함', () => {
    const { container } = render(<LoadingSpinner />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveAttribute('role', 'status')
    expect(wrapper).toHaveAttribute('aria-label', '로딩 중')
  })

  test('접근성: sr-only 텍스트 포함', () => {
    render(<LoadingSpinner />)
    const srOnly = screen.getByText('로딩 중입니다...')
    expect(srOnly).toHaveClass('sr-only')
  })

  test('custom className 적용', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })
})

