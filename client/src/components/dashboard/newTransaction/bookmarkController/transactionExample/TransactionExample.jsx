import { useParams } from 'react-router-dom';

export default function TransactionExample() {

    let {bookmarkId} = useParams();

    console.log(bookmarkId);
    return (
    <div>This is an tra</div>
  )
}
