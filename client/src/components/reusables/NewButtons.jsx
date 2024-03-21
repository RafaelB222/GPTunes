// GENERAL BUTTON STYLES

export function LightButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='buttonCss hover:ring-2 bg-themePalePink border-themeNavy text-themeNavy  ring-themeNavy/50 '
    >
      {buttonText}
    </button>
  );
}

export function DarkButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='buttonCss hover:ring-2 border-themePalePink bg-themeNavy text-themePalePink  ring-themePalePink/50'
    >
      {buttonText}
    </button>
  );
}

export function PinkButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='buttonCss hover:ring-2 border-themeMidPink text-themeMidPink  ring-themeMidPink/50 '
    >
      {buttonText}
    </button>
  );
}

export function BlueButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='buttonCss border-themeMidBlue text-themeMidBlue hover:ring-2 ring-themeMidBlue/50 '
    >
      {buttonText}
    </button>
  );
}

export function OrangeButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='buttonCss border-themeOrange text-themeOrange hover:ring-2 ring-themeOrange/50 '
    >
      {buttonText}
    </button>
  );
}

// ALTERNATIVE BUTTONS

export function DarkLinkButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='p-2 text-themeNavy underline underline-offset-8 hover:decoration-themeMidPink transition duration-800 ease-in-out'
    >
      {buttonText}
    </button>
  );
}

export function LightLinkButton({ buttonText, action, disabled }) {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className='p-2 text-themePalePink underline underline-offset-8 hover:decoration-themeMidBlue transition duration-800 ease-in-out'
    >
      {buttonText}
    </button>
  );
}

// SPECIFIC BUTTON STYLES

export function SpotifyButton({ buttonText, action, trueState }) {
  const buttonClass = trueState
    ? 'bg-green-500 text-white opacity-50 cursor-not-allowed'
    : 'border-themeOrange text-themeOrange hover:ring-2 ring-themeOrange/50';

  const handleClick = trueState ? null : action;

  return (
    <button
      className={`p-2 border-2 rounded-md ${buttonClass} transition duration-500 ease-in-out`}
      onClick={handleClick}
      disabled={trueState}
    >
      {trueState ? 'Connected \u2713' : buttonText}
    </button>
  );
}
