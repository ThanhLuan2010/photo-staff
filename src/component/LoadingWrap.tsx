import BounceLoader from "react-spinners/BounceLoader";
import LoadingOverlay from "react-loading-overlay";
import React from "react";
interface LoadinWrapProps {
  active: boolean;
  children: any;
}
const LoadingWrap: React.FC<LoadinWrapProps> = ({ active, children }): React.JSX.Element => {
  return (
    <LoadingOverlay active={active} spinner={<BounceLoader />}>
      {children}
    </LoadingOverlay>
  );
};
export default LoadingWrap;
