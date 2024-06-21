import { IBook } from "../types";

export default function getBookDTO(book: IBook | IBook[]) {
  const transformBook = (b: IBook) => {
    return {
      id: b._id,
      title: b.title,
      author: b.genres,
      publicationDate: b.publicationDate,
    };
  };

  if (Array.isArray(book)) {
    return book.map(transformBook);
  } else {
    return transformBook(book);
  }
}
