import { modalTypes } from 'components/modalContext';
import NoteDropdownMenu from 'components/NoteDropdownMenu';
import PropTypes from 'prop-types';

function AnimationTechnique({ id, title }) {
  return (
    <span>
      <span>{title}</span>
      <NoteDropdownMenu id={id} modalType={modalTypes.animationTechnique} />
    </span>
  );
}

AnimationTechnique.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AnimationTechnique;
