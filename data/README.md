# Precomputed Conversations

The complete corpus of conversations that (generated) users have with one
another is stored [here][1]. This corpus was created with data from the [Cornell
Movie-Dialogs Corpus][2], a large metadata-rich collection of fictional
conversations extracted from raw movie scripts. Also includes 100 memes from
[imgflip's API][4].

If for some reason you want to regenerate the corpus, run
[`node ./generate-corpus.js`][3].

Latest corpus stats:

- 7510 total lines
- 5331 generated usernames
- 100 unique memes

Movie titles Used:

- The Fifth Element
- The Bourne Supremacy
- Cast Away
- Godzilla
- Ghostbusters
- Gladiator
- I Am Legend
- Independence Day
- Men In Black
- Minority Report
- Mighty Morphin Power Rangers
- The Mummy
- Pirates Of The Caribbean
- Signs
- The Sixth Sense
- Spider-Man
- The Day The Earth Stood Still
- The War Of The Worlds
- Batman Returns
- Batman And Robin
- Batman Forever
- Batman
- The Bourne Identity
- Contact
- Fantastic Voyage
- Kafka
- The Matrix
- Planet Of The Apes
- Supergirl
- Superman III
- Superman II
- Superman IV: The Quest For Peace
- Superman
- The X Files
- Titanic
- Toy Story
- Tron
- Unbreakable
- The Wizard Of Oz

[1]: ./corpus.json
[2]: https://www.cs.cornell.edu/~cristian/Cornell_Movie-Dialogs_Corpus.html
[3]: ./generate-corpus.js
[4]: https://imgflip.com/api
