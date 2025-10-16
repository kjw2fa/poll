import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './menubar';

describe('Menubar component', () => {
  test('renders Menubar and MenubarTrigger', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByRole('menuitem', { name: /File/i })).toBeInTheDocument();
  });

  test('opens MenubarContent on trigger click', async () => {
    const user = userEvent.setup(); // Setup userEvent
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByRole('menuitem', { name: /Edit/i })); // Use user.click
    const menu = await screen.findByRole('menu'); // Use findByRole
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Undo/i })).toBeInTheDocument();
  });

  test('renders MenubarItem', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await user.click(screen.getByRole('menuitem', { name: /View/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Zoom/i })).toBeInTheDocument();
  });

  test('renders MenubarCheckboxItem', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Options</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await user.click(screen.getByRole('menuitem', { name: /Options/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: /Show Toolbar/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: /Show Toolbar/i })).toBeChecked();
  });

  test('renders MenubarRadioGroup and MenubarRadioItem', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Align</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="left">
              <MenubarRadioItem value="left">Left</MenubarRadioItem>
              <MenubarRadioItem value="center">Center</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await user.click(screen.getByRole('menuitem', { name: /Align/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: /Left/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: /Left/i })).toBeChecked();
    expect(screen.getByRole('menuitemradio', { name: /Center/i })).not.toBeChecked();
  });

  test('renders MenubarLabel and MenubarSeparator', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>About</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>Documentation</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await user.click(screen.getByRole('menuitem', { name: /Help/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('renders MenubarSub and MenubarSubTrigger', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Share</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Share with</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await user.click(screen.getByRole('menuitem', { name: /Share/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Share with/i })).toBeInTheDocument();
  });
});
