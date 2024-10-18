import { supabase } from "../../../supabaseClient";

export const handler = async (event, context) => {
  try {
    // Step 1: Query the 'problem_counts' view
    const { data: problemCounts, error } = await supabase
      .from('problem_counts')
      .select('*');

    if (error) throw error;

    // Step 2: Transform the data into the required JSON format
    const snapshot = {
      total: {},
      draft: {},
      idea: {},
      endorsed: {},
      published: {}
    };

    problemCounts.forEach(row => {
      const category = row.category;

      snapshot.total[category] = row.total;
      snapshot.draft[category] = row.draft;
      snapshot.idea[category] = row.idea;
      snapshot.endorsed[category] = row.endorsed;
      snapshot.published[category] = row.published;
    });

    // Step 3: Insert the snapshot into 'problem_counts_snapshot' table
    const { error: insertError } = await supabase
      .from('problem_counts_snapshot')
      .insert([{ counts: snapshot }]);

    if (insertError) throw insertError;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Snapshot inserted successfully.' })
    };
  } catch (error) {
    console.error('Error inserting snapshot:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
