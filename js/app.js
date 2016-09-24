/*global Vue, noteStorage */

(function (exports) {

	'use strict';

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.noteapp',

		data: {
			notes: noteStorage.fetch(),
			newNote: '',
			editedNote: null,
			editing: false,
			visibility: 'all'
		},

		watch: {
			notes: {
				deep: true,
				handler: noteStorage.save
			}
		},

		computed: {
			remaining: function () {
				return this.notes.length;
			}
		},

		methods: {

			addNote: function () {
				var value = this.newNote && this.newNote.trim();
				if (!value) {
					return;
				}
				this.notes.push({
					title: value,
					completed: false,
					pos:{ top: 120, left: 0 }
				});
				this.newNote = '';
			},

			removeNote: function (note) {
				this.notes.$remove(note);
			},

			editNote: function (note) {
				this.beforeEditCache = note.title;
				this.editedNote = note;
				this.editing = true;
			},

			doneEdit: function (note) {
				if (!this.editedNote) {
					return;
				}
				this.editedNote = null;
				this.editing = false;
				note.title = note.title.trim();

				if (!note.title) {
					this.removeNote(note);
				}
			},

			cancelEdit: function (note) {
				this.editedNote = null;
				this.editing = false;
				note.title = this.beforeEditCache;
			}

		},

		directives: {

			'note-focus': function (value) {
				if (!value) {
					return;
				}
				var el = this.el;
				Vue.nextTick(function () {
					el.focus();
				});
			},

			'note-drag-drop': function (value) {
			    var el = this.el;
			    var mover = false, x, y, posx, posy, first = true;
			    var isSticky = function (event) {
			    	return (event.target.className === 'front');
			    };

			    el.onmousedown = function(e) {
			    	if (isSticky(e)) {
				    	el.classList.add('dragging');
				        mover = true;
			    	}
			    };

			    el.onmouseup = function(e) {
					if (isSticky(e)) {
				        var notes = noteStorage.fetch();
				        var posObj = {pos: {
				        	top: posy + 'px',
				        	left: posx + 'px'
				        }};

				        Object.assign(notes[value.index], posObj);

				        Vue.set(value.note, 'pos', posObj.pos);

				        mover = false;
				        first = true;

				        el.classList.remove('dragging');

						Vue.nextTick(function () {
					        noteStorage.save(notes);
				        });
			    	}
			    };

			    el.onmousemove = function(e) {
			        if (mover) {
			            if (first) {
			                x = e.offsetX;
			                y = e.offsetY;
			                first = false;
			            }
			            posx = e.pageX - x;
			            posy = e.pageY - y;
			            this.style.left = posx + 'px';
			            this.style.top = posy + 'px';
			        }
			    };

			    el.onmouseleave = function (e) {
			    	if (mover) {
			    		mover = false;
			    		first = true;

			    		el.classList.remove('dragging');
			    	}
			    };
			}

		}
	});

})(window);
