import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

interface Props {
  loading: boolean;
}
function EmptyComponent({ loading }: Props) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      {loading ? <BounceLoader /> : <p className="text-2xl">Danh sách trống</p>}
    </div>
  );
}

export default EmptyComponent;
{
  /* <LoadingOverlay active={active} spinner={<BounceLoader />}>
{children}
</LoadingOverlay> */
}
