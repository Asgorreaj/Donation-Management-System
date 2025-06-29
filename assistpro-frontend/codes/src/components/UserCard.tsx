import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {deleteAuthCookie, getUserData} from "@/actions/auth.action";
import {useMfi} from "@/context/MfiContext";

export const UserCard = () => {
  const {mfi} = useMfi();
  const router = useRouter();
  const [user, setUser] = React.useState({'full_name': ''});

  // React.useEffect(() => {
  //   const fetchUserData = async () => {
  //     const data = await getUserData();
  //     setUser(data);
  //   };
  //   fetchUserData();
  // }, []);

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    router.replace(`/${mfi}/login`);
  }, [mfi, router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='secondary'
            size='md'
            src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>{user.full_name}</p>
        </DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
