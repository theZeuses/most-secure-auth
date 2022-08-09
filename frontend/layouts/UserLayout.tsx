import { ReactNode } from "react";
import Nav from "../components/Nav";

type UserLayoutProps = {    
    children: ReactNode
}
function UserLayout({ children }: UserLayoutProps) {
    return (
        <div>
            <Nav />
            <main>{children}</main>
        </div>
    );
}

export default UserLayout;