# Precomputed Conversations

The complete corpus of conversations that (generated) users have with one
another is stored [here][1]. This corpus was created with data from the [Cornell
Movie-Dialogs Corpus][2], a large metadata-rich collection of fictional
conversations extracted from raw movie scripts. Also includes 100 memes from
[imgflip's API][4].

If for some reason you want to regenerate the corpus, run
[`node ./generate-corpus.js`][3]. You will have to re-add the `memes` key
manually.

Latest corpus stats:

- 7318 total lines
- 5331 unique usernames
- 100 unique memes

Movie titles used:

- The Fifth Element
- The Bourne Supremacy
- Cast Away
- Godzilla
- Ghostbusters
- Gladiator
- I Am Legend
- Independence Day
- Men in Black
- Minority Report
- Mighty Morphin Power Rangers
- The Mummy
- Pirates of the Caribbean
- Signs
- The Sixth Sense
- Spider-Man
- The Day the Earth Stood Still
- The war of the Worlds
- Batman Returns
- Batman and Robin
- Batman Forever
- Batman
- The Bourne Identity
- Contact
- Fantastic Voyage
- The Matrix
- Planet of the Apes
- Supergirl
- Superman III
- Superman II
- Superman IV: The Quest for Peace
- Superman
- The X Files
- Titanic
- Toy Story
- Tron
- Unbreakable
- The Wizard of Oz

[1]: ./corpus.json
[2]: https://www.cs.cornell.edu/~cristian/Cornell_Movie-Dialogs_Corpus.html
[3]: ./generate-corpus.js
[4]: https://imgflip.com/api
