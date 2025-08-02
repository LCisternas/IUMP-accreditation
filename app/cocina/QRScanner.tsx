  import { useState } from 'react';
  import BarcodeScanner from 'react-qr-barcode-scanner';

  const App = () => {
    const [data, setData] = useState('No result');

    return (
      <>
        <BarcodeScanner
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) setData("hola");
            else setData('No result');
          }}
        />
        <p>{data}</p>
      </>
    );
  };
