// import { css, jsx } from '@emotion/react';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import EditIcon from '@mui/icons-material/Edit';

// const formStyles = css`
//   position: relative;
//   width: 100%;

//   label {
//     display: block;
//   }
//   button {
//     margin: 10px;
//     padding: 5px 10px;
//     background-color: none;
//   }
// `;

// async function deleteBookmark(id) {
//   const bookmarkResponse = await fetch(`/api/bookmarks`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   const deletedBookmark = await bookmarkResponse.json();
//   const newState = bookmarkList.filter(
//     (bookmark) => bookmark.id !== deletedBookmark.id,
//   );
//   setBookmarkList(newState);
// }

// async function updateBookmark(id, bookmarkname, note) {
//   const bookmarkResponse = await fetch(`${props.baseUrl}/api/bookmarks`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ bookmarkname: bookmarkname, note: note }),
//   });

//   const updatedBookmark = await bookmarkResponse.json();

//   const newSate = [...props.bookmarkList];

//   const outdatedBookmark = newSate.find(
//     (bookmark) => bookmark.id === updatedBookmark.id,
//   );

//   outdatedBookmark.bookmarkname = updatedBookmark.bookmarkname;
//   outdatedBookmark.note = updatedBookmark.note;

//   setBookmarkList(newSate);
// }
// export default function NoteSection(props) {
//   return (
//     <>
//       <div css={formStyles}>
//         <h2>Note List</h2>
//         {showForm ? props.showFormFunction() : null}
//         {console.log('bmlist', bookmarkList)}
//         {bookmarkList.map((bookmark) => (
//           <div key={`bookmark-li-${bookmark.id}`}>
//             {}
//             <form
//               onSubmit={(event) => {
//                 event.preventDefault();
//               }}
//             >
//               <p style={{ margin: '0px', paddingLeft: '10px' }}>
//                 <input
//                   style={{ marginRight: '20px', fontSize: 'px' }}
//                   value={bookmark.bookmarkname}
//                   onChange={(event) => event.currentTarget.value}
//                 />
//                 {bookmark.time}
//                 <span style={{ marginLeft: '100px' }}>
//                   <button
//                     onClick={() => {
//                       deleteBookmark(bookmark.id);
//                     }}
//                   >
//                     <DeleteForeverIcon
//                       style={{
//                         width: '20px',
//                         height: '30px',
//                         padding: '0px',
//                         margin: '0px',
//                       }}
//                     />
//                   </button>
//                   <button
//                     onClick={() => {
//                       deleteBookmark(bookmark.id);
//                     }}
//                   >
//                     <EditIcon
//                       style={{
//                         width: '20px',
//                         height: '30px',
//                         padding: '0px',
//                         margin: '0px',
//                       }}
//                     />
//                   </button>
//                 </span>
//                 {console.log('bookmarkdbstime', bookmark.time)}
//               </p>

//               <label>
//                 <textarea
//                   value={bookmark.note}
//                   css={inputBox}
//                   rows="60"
//                   cols="60"
//                   name="content"
//                   placeholder="Enter Notes here..."
//                   onChange={(event) => event.currentTarget.value}
//                 />
//               </label>

//               <button>Save</button>
//             </form>
//           </div>
//         ))}
//       </div>
//       ;
//     </>
//   );
// }
