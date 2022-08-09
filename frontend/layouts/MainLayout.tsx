import { ReactNode } from "react";
import Header from "../components/Header";

type MainLayoutProps = {    
    children: ReactNode
}
function MainLayout({ children }: MainLayoutProps) {
    return (
        <main>
            <Header />
            <div>{children}</div>
        </main>
    );
}

export default MainLayout;