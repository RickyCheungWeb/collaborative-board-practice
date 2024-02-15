import Image from 'next/image';

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className='h-full w-full flex flex-col gap-y-4 justify-center items-center'>
      <Image
        src='/Logo.svg'
        alt='logo'
        width={120}
        height={120}
        className='animate-pulse duration-700'
      />
    </div>
  );
};

export default Loading;