import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AppHook from "../hooks/AppHook";
import Login from "../pages/Login";
import Header from "../components/Header";
import Homepage from "../pages/Homepage";
// import Navbar from "../components/Navbar";
import ViewFile from "../pages/ViewFile";
import { PdfContextProvider } from "../contexts/pdfContext";
import DiskStorage from "../components/DiskStorage";
import FolderYear from "../pages/FolderYear";
import FolderMonth from "../pages/FolderMonth";
import UploadFile from "../components/UploadFile";
import RightClick from "../components/RigthClick";
import { RigthMenuProvider } from "../contexts/RightContext";
import FormRename from "../components/FormRename";
import NotFound from "../pages/NotFound";
import DuplicateFile from "../components/DuplicateFile";
import FormNameTag from "../components/FormNameTag";

const guestRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Outlet />
        </>,
        children: [
            { index: true, element: <Login />}
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

const userRouter = createBrowserRouter([
    {
        path: '/',
        element: <RigthMenuProvider>
            <PdfContextProvider>
                {/* <Navbar /> */}
                <FormRename />
                <FormNameTag />
                <DuplicateFile />
                <RightClick />
                <Header />
                <Outlet />
                <DiskStorage />
                <UploadFile />
            </PdfContextProvider>
        </RigthMenuProvider>,
        children: [
            { index: true, element: <Homepage />},
            { path: 'view/file/:fileId', element: <ViewFile />},
            { path: 'year/:yearName', element: <FolderYear />},
            { path: 'year/:yearName/month/:monthName', element: <FolderMonth />},
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

function AppRoute() {
    const { user } = AppHook()!;
    const finalRoter = user?.fullname ? userRouter : guestRouter;
    return <RouterProvider router={finalRoter} />
}

export default AppRoute;