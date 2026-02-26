import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


export const SkeletonLoadingAudioRes = () => (
  <div className="categorySoundCard">
    {/* <div className="categorySoundCardImg"><Skeleton height={100} width={50} circle /></div> */}
    <div className="categorySoundCardHead"><Skeleton height={100} width="100%" /></div>
    {/* <li className="categorySoundCardPlayIcon"><Skeleton height={80} width="80%" /></li> */}
    {/* <Skeleton height={60} width="40%" /> */}
  </div>
);