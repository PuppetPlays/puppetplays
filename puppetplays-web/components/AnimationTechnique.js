import { modalTypes } from 'components/modalContext';
import PropTypes from 'prop-types';
import NoteDropdownMenu from 'components/NoteDropdownMenu';

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
