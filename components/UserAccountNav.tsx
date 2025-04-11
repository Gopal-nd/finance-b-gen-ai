'use client'

import { FC } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

import { DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import UserAvatarProps from "./UserAvatarProps";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
interface UserAccounNavProps {
  user: any
}

const UserAccounNav: FC<UserAccounNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatarProps
          user={{ name: user.name || null, image: user.image || null }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end">
        <div className="flex p-2 items-center justify-start gap-2">
            <div className="flex flex-col space-y-1 leading-none">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email&& <p className="w-[200px] text-sm ">
                    {user.email}
                </p>}
            </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem  className="cursor-pointer">
        <Button onClick={async()=>{
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/sign-in")
            },
          },
        });
      }}>
        Logout
      </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccounNav;
