import { ReactNode } from 'react';
import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header username={props.username} />
      <main>{props.children}</main>
    </div>
  );
}
