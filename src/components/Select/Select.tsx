import React, { FC, useRef } from 'react';
import classnames from 'classnames';

import './Select.style.scss';
import { Props } from './Select.types';
import { DEFAULTS, STYLE } from './Select.constants';
import { useSelectState } from '@react-stately/select';
import { useButton } from '@react-aria/button';
import { DismissButton, useOverlay } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { useSelect, HiddenSelect } from '@react-aria/select';
import ListBox from '../ListBox';
import Icon from '../Icon';

// eslint-disable-next-line @typescript-eslint/ban-types
const Select: FC<Props<unknown>> = <T extends object>(props: Props<T>) => {
  const { className, isDisabled, label, name, placeholder } = props;
  const state = useSelectState(props);

  const boxRef = useRef<HTMLUListElement>(null);

  const selectRef = useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, selectRef);

  const { buttonProps } = useButton({ ...triggerProps, isDisabled }, selectRef);
  delete buttonProps.color;

  const overlayRef = useRef(null);
  const { overlayProps } = useOverlay(
    {
      onClose: () => state.close(),
      shouldCloseOnBlur: true,
      isOpen: state.isOpen,
      isDismissable: true,
    },
    overlayRef
  );

  const listBox = (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={() => state.close()} />
        <ListBox
          ref={boxRef}
          {...menuProps}
          state={state}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={state.focusStrategy || true}
        />
        <DismissButton onDismiss={() => state.close()} />
      </div>
    </FocusScope>
  );

  return (
    <div className={classnames(className, STYLE.wrapper)}>
      {label && (
        <label htmlFor={name} {...labelProps}>
          {label}
        </label>
      )}
      <HiddenSelect state={state} triggerRef={selectRef} label={label} name={name} />
      <button
        id={name}
        className={classnames(
          STYLE.dropdownInput,
          { [STYLE.selected]: state.selectedItem },
          { [STYLE.open]: state.isOpen }
        )}
        {...buttonProps}
        ref={selectRef}
      >
        <span {...valueProps} className={STYLE.selectedItemWrapper}>
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>
        <span aria-hidden="true" className={STYLE.iconWrapper}>
          <Icon name={state.isOpen ? 'arrow-up' : 'arrow-down'} weight="bold" scale={16} />
        </span>
      </button>
      {state.isOpen && listBox}
    </div>
  );
};

/**
 * Dropdown / Select Element which displays a listbox with options.
 */

export default Select;
