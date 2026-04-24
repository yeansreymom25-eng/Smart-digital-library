import {
  getReaderBookDetail,
  type ReaderBookDetail,
} from "@/src/lib/readerBookDetails";

export type ReaderContentPage = {
  number: number;
  kind: "title" | "chapter" | "content" | "closing";
  eyebrow?: string;
  heading?: string;
  paragraphs: string[];
};

export type ReaderBookContent = {
  book: ReaderBookDetail;
  pages: ReaderContentPage[];
};

function buildParagraphPool(book: ReaderBookDetail) {
  return [
    `${book.title} invites the reader into a focused, immersive experience where each chapter is meant to be read slowly and with attention. ${book.description}`,
    `This digital reading edition keeps the language calm, readable, and spacious, so the story or ideas can breathe the way they would in a premium modern reading app.`,
    `As the pages unfold, ${book.title} stays centered on its strongest promise: meaningful reading that feels deliberate, comfortable, and beautifully paced from screen to screen.`,
    `The voice of ${book.author} comes through most clearly when the text is given room, rhythm, and a steady visual structure. That is the atmosphere this reader is designed to preserve.`,
    `Good reading experiences do more than display text. They create a sense of presence. In ${book.title}, the chapters are framed to feel intimate, focused, and easy to return to.`,
    `Every section here is arranged so the reader can follow ideas naturally, with page turns that feel closer to a real book than a browser preview or a document viewer.`,
    `The pacing of ${book.title} works best when each spread feels intentional. On larger screens, the book opens like a two-page edition, while smaller screens keep reading clear and simple.`,
    `This approach turns digital reading into something calmer and more elegant. It avoids distraction, keeps the layout balanced, and gives the text a stronger sense of atmosphere.`,
    `Readers often decide whether they love a book within the first few moments of reading. That is why the preview in this edition is designed to feel polished, inviting, and believable.`,
    `By keeping the experience inside the website, ${book.title} becomes part of a real library journey. Discovery, purchase, reading, and return all happen within one connected product.`,
    `This reading mode also prepares the project for future real book content. The interface is ready for richer chapters, full uploads, and stronger backend integration when those files are available.`,
    `For now, the pages are structured to give the right feeling: a premium digital shelf, a focused reading surface, and gentle transitions that help the reader stay inside the book.`,
    `Whether the reader opens ${book.title} for a quick session or a longer one, the layout is meant to feel trustworthy, immersive, and refined rather than temporary or improvised.`,
    `A strong reading experience is part design and part rhythm. The typography, spacing, shadow, and motion all work together so the content feels like a modern book app rather than a file preview.`,
    `That is the intention behind this in-app reader: to make reading from a browser feel closer to opening a real digital book, with continuity across devices and screens.`,
    `When the final spread closes, ${book.title} should feel readable, calm, and complete. The interface steps back, and the reading itself becomes the focus.`,
  ];
}

function chunkParagraphs(paragraphs: string[], chunkSize: number) {
  const chunks: string[][] = [];

  for (let index = 0; index < paragraphs.length; index += chunkSize) {
    chunks.push(paragraphs.slice(index, index + chunkSize));
  }

  return chunks;
}

function buildPages(book: ReaderBookDetail): ReaderContentPage[] {
  const paragraphPool = buildParagraphPool(book);
  const chunks = chunkParagraphs(paragraphPool, 2);

  const pages: ReaderContentPage[] = [
    {
      number: 1,
      kind: "title",
      eyebrow: "Smart Digital Library Edition",
      heading: book.title,
      paragraphs: [
        `By ${book.author}`,
        "A smooth in-app reading experience designed for focused, elegant, modern book reading.",
      ],
    },
    {
      number: 2,
      kind: "chapter",
      eyebrow: "Opening Chapter",
      heading: "Begin Reading",
      paragraphs: [
        `${book.title} starts here with a calm, immersive spread created for digital reading inside the website.`,
        "Turn the page using the arrows, keyboard, touch, or the edge of the reader surface.",
      ],
    },
  ];

  chunks.forEach((paragraphs, index) => {
    pages.push({
      number: pages.length + 1,
      kind: index % 3 === 0 ? "chapter" : "content",
      eyebrow: index % 3 === 0 ? `Chapter ${Math.floor(index / 3) + 1}` : undefined,
      heading: index % 3 === 0 ? `${book.title} — Section ${Math.floor(index / 3) + 1}` : undefined,
      paragraphs,
    });
  });

  pages.push({
    number: pages.length + 1,
    kind: "closing",
    eyebrow: "End of Sample Edition",
    heading: "Continue Reading",
    paragraphs: [
      `You have reached the end of the current in-app reading sample for ${book.title}.`,
      "This reader is ready to connect to full uploaded book files later while keeping the same premium in-website experience.",
    ],
  });

  return pages;
}

export async function getReaderBookContent(id: string): Promise<ReaderBookContent | null> {
  const book = await getReaderBookDetail(id);

  if (!book) {
    return null;
  }

  return {
    book,
    pages: buildPages(book),
  };
}