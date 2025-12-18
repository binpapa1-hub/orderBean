import Header from './common/Header'

/**
 * Navbar 컴포넌트 (하위 호환성을 위한 별칭)
 * 
 * @deprecated Header 컴포넌트를 직접 사용하는 것을 권장합니다.
 * 이 컴포넌트는 기존 코드와의 호환성을 위해 유지됩니다.
 * 
 * @example
 * // 권장: Header 컴포넌트 직접 사용
 * <Header variant="default" showAuth={true} />
 * 
 * // 하위 호환: Navbar 사용 (내부적으로 Header 사용)
 * <Navbar />
 */
const Navbar = () => {
  return (
    <Header 
      variant="default"
      showAuth={true}
      showAdmin={true}
      showOrders={true}
      title="☕ OrderBean"
    />
  )
}

export default Navbar

