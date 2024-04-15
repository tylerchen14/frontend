import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const StreamContent = dynamic(() => import('@/components/stream/stream'), {
  ssr: false,
})

function StreamingPage() {
  const router = useRouter();
  const { streamerPath } = router.query;

if(!streamerPath){
  return <div>Loading......</div>
}

  return (
    <div>
      <h1>Streaming for: {streamerPath}</h1>
      <StreamContent streamerPath={streamerPath} />
    </div>
  );
}

export default StreamingPage;
