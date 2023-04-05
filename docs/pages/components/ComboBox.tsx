import React, { ChangeEvent, useRef, useState } from 'react';
import styles from './style.module.css';

type itemProps = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
} | undefined;

type ComboBoxProps = {
  items?: itemProps[];
}

const ComboBox = ({items}: ComboBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<itemProps>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const comboBoxId = 'my-combobox';
  let sortedFilteredItems;

  // These threw an error about possibly being null and value was not assignable to type string
  const inputRef = useRef(null as any);
  const toggleRef = useRef(null as any);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (item: itemProps) => {
    console.log(item);
    setSelectedItem(item);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.value = item?.label;
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === '') {
      setSearchTerm('');
    }
  };

  const handleToggleKeyDown = (event: any) => {
    switch (event.key) {
      case 'Enter':
      case 'Space':
        setIsOpen((isOpen) => !isOpen);
        break;
        case 'Escape':
          setIsOpen(false);
          toggleRef.current.querySelector('button').focus();
          break;
          case 'ArrowDown':
            setIsOpen(true);
            inputRef.current.focus();
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();

      const activeElement = document.activeElement;
      if (activeElement && activeElement.nextSibling) {
        activeElement.nextSibling.focus();
      }
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();

      const activeElement = document.activeElement;
      if (activeElement && activeElement.previousSibling) {
        activeElement.previousSibling.focus();
      }
    }
  };


  const filteredItems = items?.filter(
    (item) =>
      item?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.phone.includes(searchTerm.toLowerCase()) || ''
  );

  if (searchTerm === '') {
    // sort by suggested items first
    sortedFilteredItems = filteredItems?.sort((a, b) => {
      if (a?.suggested && !b?.suggested) return -1;
      if (b?.suggested && !a?.suggested) return 1;
      return 0;
    });
  }

  return (
    <div className={styles.comboBox} role="combobox" aria-expanded={isOpen} ref={toggleRef}>
      <input
        type="text"
        placeholder="Search items"
        defaultValue={selectedItem ? selectedItem.label : ''}
        onChange={handleInputChange}
        ref={inputRef}
        onBlur={() => setIsOpen(false)}
        className={styles.comboBoxInput}
        style={{ display: isOpen ? 'block' : 'none' }}
        aria-labelledby={`${comboBoxId}-label`}
      />
      <button
        className={styles.comboBoxToggle}
        onClick={toggleOpen}
        id={comboBoxId}
        aria-haspopup="listbox"
        aria-labelledby={`${comboBoxId}-label`}
        tabIndex={0}
        onKeyDown={handleToggleKeyDown}

      >
        {selectedItem ? selectedItem?.label : 'Select an item'}
      </button>
      {isOpen && (
        <div className={styles.comboBoxItems} role="listbox" onKeyDown={handleKeyDown}>
        {sortedFilteredItems?.map((item, index) => (
          <button
            key={index}
            onClick={() => selectItem(item)}
            aria-selected={selectedItem === item}
            aria-labelledby={`${comboBoxId}-label ${comboBoxId}-item-${index}`}
            tabIndex={0}
            role="option"
            aria-activedescendant={`${comboBoxId}-item-${index}`}
          >
            {`${item?.code} - ${item?.label} - ${item?.phone}`}
          </button>
        ))}
      </div>
      )}
    </div>
  );
};

export default ComboBox;
