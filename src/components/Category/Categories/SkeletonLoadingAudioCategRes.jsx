import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

export const SkeletonLoadingAudioCategRes = () => (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
      <Skeleton height={20} width="100%" style={{ marginBottom: '10px' }} />
      <Skeleton height={20} width="60%" style={{ marginBottom: '10px' }} />
      <Skeleton height={16} width="50%" />
    </div>
);