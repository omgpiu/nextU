import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import Logo from '/public/logo.png'


const Layout: React.FC = ({ children }) => {
    return <div className="page">
        <Link href="/"><a className="logo"><Image src={ Logo } alt={ 'Logo' }/></a></Link>
        { children }
    </div>
}
export default Layout
