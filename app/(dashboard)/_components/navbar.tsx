"use client";

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
  const { organization } = useOrganization(); //logic to hide invite button 1, need to destruct the variable
  return (
    <div className="flex items-cetner gap-x-4 p-5 ">
      <div className="hidden lg:flex lg:flex-1 ">
        {/* TODO:ADD SEARCH */}
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "376px",
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                justifyContent: "space-between",
                backgroundClip: "white",
              },
            },
          }}
        />
      </div>
      {organization && <InviteButton />}

      <UserButton />
    </div>
  );
};